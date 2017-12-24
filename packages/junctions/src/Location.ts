/**
 * An object that store the parts of a URL that can correspond to a
 * a specific screen within your application.
 */
export type Location = {
    pathname: string,
    search?: string,
    hash?: string,
    state?: object,
}


export function concatLocations(left: Location, rightLocationOrString: Location | string): Location {
    let right: Location =
        typeof rightLocationOrString === 'string'
            ? parseLocationString(rightLocationOrString)
            : rightLocationOrString
    
    return {
        pathname: joinPaths(left.pathname, right.pathname),
        search: joinQueryStrings(left.search, right.search, '?'),
        hash: joinQueryStrings(left.hash, right.hash, '#'),
        state: left.state || right.state ? Object.assign({}, left.state, right.state) : undefined,
    }
}
    
const parsePattern = /^((((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/
function parseLocationString(locationString: string): Location {
    let matches = parsePattern.exec(locationString)
    if (!matches) {
        throw new Error("Tried to parse a non-URI object.")
    }
    return {
        pathname: matches[2],
        search: matches[6],
        hash: matches[7],
    }
}

function joinPaths(a, b) {
    if (!b) {
        return a
    }
    if (a[a.length-1] === '/') {
        a = a.substr(0, a.length - 1)
    }
    if (b[0] === '/') {
        b = b.substr(1)
    }
    return a + '/' + b
}

function joinQueryStrings(left, right, leadingCharacter='?'): string {
    if (!left || left[0] !== leadingCharacter) {
        return right
    }
    if (!right || right[0] !== leadingCharacter) {
        return left
    }
    return leadingCharacter+left.slice(1)+'&'+right.slice(1)
}


export function parseQuery(queryString?: string, leadingCharacter='?'): { [name: string]: any } {
    if (!queryString || queryString[0] != leadingCharacter) {
        return {}
    }

    let query = {}
    let queryParts = queryString.slice(1).split('&')
    for (let i = 0, len = queryParts.length; i < len; i++) {
        const x = queryParts[i].split('=')
        query[x[0]] = x[1] ? decodeURIComponent(x[1]) : ''
    }
    return query
}

export function stringifyQuery(query: { [name: string]: any }, leadingCharacter='?') {
    let keys = Object.keys(query)
    if (keys.length === 0) {
      return ''
    }
  
    let parts: string[] = []
    for (let i = 0, len = keys.length; i < len; i++) {
      let key = keys[i]
      let value = String(query[key])
      parts.push(value === '' ? key : key+'='+encodeURIComponent(value))
    }
  
    return leadingCharacter + parts.join('&')
  }