import expect, {createSpy, spyOn} from 'expect'
import xmock from 'xmock'
import path from 'path'
import fs from 'fs'
import qs from 'querystring'
import jsYaml from 'js-yaml'
import {execute, buildRequest, baseUrl, applySecurities, self as stubs} from '../../../../src/execute'

const petstoreSpec = jsYaml.safeLoad(fs.readFileSync(path.join('test', 'oas3', 'data', 'petstore-oas3.yaml'), 'utf8'))

describe('OAS 3.0 - buildRequest w/ `style` & `explode` - query parameters', function () {
  describe('primitive values', function () {
    const VALUE = 5

    it('default: should build a query parameter in form/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query'
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format with allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false,
                  allowReserved: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: ':/?#[]@!$&\'()*+,;='
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=:/?#[]@!$&\'()*+,;=',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format with percent-encoding if allowReserved is not set', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: ':/?#[]@!$&\'()*+,;='
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=%3A%2F%3F%23%5B%5D%40%21%24%26%27%28%29%2A%2B%2C%3B%3D',
        credentials: 'same-origin',
        headers: {},
      })
    })
  })
  describe('array values', function () {
    const VALUE = [3, 4, 5]

    it('default: should build a query parameter in form/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query'
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3&id=4&id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3&id=4&id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3%2C4%2C5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format with allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false,
                  allowReserved: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: [
            ':', '/', '?', '#', '[', ']', '@', '!', '$', '&', '\'',
            '(', ')', '*', '+', ',', ';', '='
          ]
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=:,/,?,#,[,],@,!,$,&,\',(,),*,+,,,;,=',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format without allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: [
            ':', '/', '?', '#', '[', ']', '@', '!', '$', '&', '\'',
            '(', ')', '*', '+', ',', ';', '='
          ]
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=%3A%2C%2F%2C%3F%2C%23%2C%5B%2C%5D%2C%40%2C%21%2C%24%2C%26%2C%27%2C%28%2C%29%2C%2A%2C%2B%2C%2C%2C%3B%2C%3D',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in space-delimited/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'spaceDelimited',
                  explode: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3%20id=4%20id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in space-delimited/explode format with allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'spaceDelimited',
                  explode: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })
      // whitespace is _not_ an RFC3986 reserved character,
      // so it should still be escaped!
      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3%20id=4%20id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in space-delimited/no-explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'spaceDelimited',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3%204%205',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in pipe-delimited/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'pipeDelimited',
                  explode: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3%7Cid=4%7Cid=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in pipe-delimited/explode format with allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'pipeDelimited',
                  explode: true,
                  allowReserved: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3|id=4|id=5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in pipe-delimited/no-explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'pipeDelimited',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3%7C4%7C5',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in pipe-delimited/no-explode format with allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'pipeDelimited',
                  explode: false,
                  allowReserved: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=3|4|5',
        credentials: 'same-origin',
        headers: {},
      })
    })
  })
  describe('object values', function () {
    const VALUE = {
      role: 'admin',
      firstName: 'Alex'
    }

    it('default: should build a query parameter in form/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query'
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?role=admin&firstName=Alex',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?role=admin&firstName=Alex',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=role,admin,firstName,Alex',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format with allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false,
                  allowReserved: true
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: {
            role: 'admin',
            firstName: ':/?#[]@!$&\'()*+,;='
          }
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=role,admin,firstName,:/?#[]@!$&\'()*+,;=',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in form/no-explode format without allowReserved', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'form',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: {
            role: 'admin',
            firstName: ':/?#[]@!$&\'()*+,;='
          }
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id=role,admin,firstName,%3A%2F%3F%23%5B%5D%40%21%24%26%27%28%29%2A%2B%2C%3B%3D',
        credentials: 'same-origin',
        headers: {},
      })
    })

    it('should build a query parameter in deepObject/explode format', function () {
      // Given
      const spec = {
        openapi: '3.0.0',
        paths: {
          '/users': {
            get: {
              operationId: 'myOperation',
              parameters: [
                {
                  name: 'id',
                  in: 'query',
                  style: 'deepObject',
                  explode: false
                }
              ]
            }
          }
        }
      }

      // when
      const req = buildRequest({
        spec,
        operationId: 'myOperation',
        parameters: {
          id: VALUE
        }
      })

      expect(req).toEqual({
        method: 'GET',
        url: '/users?id[role]=admin&id[firstName]=Alex',
        credentials: 'same-origin',
        headers: {},
      })
    })
  })
})
