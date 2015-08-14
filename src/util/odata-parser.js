import {LogManager} from 'aurelia-framework';
import _ from 'lodash';

const logger = LogManager.getLogger('odata');

export const Operation = {
    EQUALS: 'eq',
    NOT_EQUALS: 'ne',
    OR: 'or',
    AND: 'and',
    IS_NULL: 'is null',
    LESS_THAN: 'lt',
    LESS_THAN_EQUALS: 'le',
    GREATER_THAN: 'gt',
    GREATER_THAN_EQUALS: 'ge',
    /**
     * Whether a defined operation is unary or binary.  Will return true
     * if the operation only supports a subject with no value.
     *
     * @param {String} op the operation to check.
     * @return {Boolean} whether the operation is an unary operation.
     */
    isUnary: function (op) {
        var value = false;
        if (op === Operation.IS_NULL) {
            value = true;
        }
        return value;
    },
    /**
     * Whether a defined operation is a logical operator or not.
     *
     * @param {String} op the operation to check.
     * @return {Boolean} whether the operation is a logical operation.
     */
    isLogical: function (op) {
        return (op === Operation.AND || op === Operation.OR);
    }
};


function ODataParserFn() {

    var REGEX = {

        parenthesis: /([(](.*)[)])$/,
        andor: /^(.*) (or|and) (.*)$/,
        op: /(\w*) (eq|gt|lt|ge|le|ne) (datetimeoffset'(.*)'|'(.*)'|[0-9]*)/,
        startsWith: /^startswith[(](.*),'(.*)'[)]/,
        endsWith: /^endswith[(](.*),'(.*)'[)]/,
        contains: /^contains[(](.*),'(.*)'[)]/
    };


    function buildLike(match, key) {
        var right = (key === 'startsWith') ? match[2] + '*' : (key === 'endsWith') ? '*' + match[2] : '*' + match[2] + '*';
        if (match[0].charAt(match[0].lastIndexOf(')') - 1) === "\'") {
            right = "\'" + right + "\'";
        }
        return {
            left: match[1],
            type: 'like',
            right: right
        };
    }

    return {
        flatten: function(predicate, result) {
            if( !result ) {
                result = [];
            }
            if( Operation.isLogical(predicate.operation) ) {
                this.flatten( predicate.left, result);
                this.flatten( predicate.right, result);
            } else {
                result.push(predicate);
            }
            return result;
        },
        parse: function (filterStr) {
            var that = this;
            var obj = {};
            if (filterStr) {
                filterStr = filterStr.trim();
            }
            var found = false;
            _.each(REGEX, function (regex) {
                if (found) {
                    return;
                }

                var match = filterStr.match(regex);
                if (match) {
                    found = true;
                    switch (regex) {
                        case REGEX.parenthesis:
                            var s = match.length > 2 ? match[2] : match[1];
                            var fnMatch;
                            if ((fnMatch = filterStr.match(REGEX.startsWith)) !== null) {
                                obj = buildLike(fnMatch, "startsWith");
                                break;
                            } else if ((fnMatch = filterStr.match(REGEX.endsWith)) !== null) {
                                obj = buildLike(fnMatch, "endsWith");
                                break;
                            } else if ((fnMatch = filterStr.match(REGEX.contains)) !== null) {
                                obj = buildLike(fnMatch, "contains");
                                break;
                            }
                            obj = that.parse(s);
                            // If the "(" is not the first character, we need to process the left side and then substitute the right side
                            if (filterStr.indexOf(s) !== 1) {
                                var dS = filterStr.substring(0, filterStr.indexOf(s) - 1);
                                var dObj = that.parse(dS + " $TEMP$");
                                dObj.value = obj;
                                obj = dObj;
                            }
                            break;
                        case REGEX.andor:
                            obj = new Predicate({
                                subject: that.parse(match[1]),
                                operator: match[2],
                                value: that.parse(match[3])
                            });
                            break;
                        case REGEX.op:
                            obj = new Predicate({
                                subject: match[1],
                                operator: match[2],
                                value: ( match[3].indexOf('\'') === -1) ? +match[3] : match[3]
                            });
                            break;
                    }
                }
            });
            logger.debug(obj);
            return obj;
        }
    };
}

export var ODataParser = new ODataParserFn();


export var Predicate = function (config) {
    if (!config) {
        config = {};
    }
    this.subject = config.subject;
    this.value = config.value;
    this.operator = (config.operator) ? config.operator : Operation.EQUALS;
    /**
     * Will serialie the predicate to an ODATA compliant serialized string.
     *
     * @return {String} The compliant ODATA query string
     */
    this.serialize = function () {
        var retValue = '';
        if (this.operator) {
            if (this.subject === undefined) {
                throw {
                    key: 'INVALID_SUBJECT',
                    msg: 'The subject is required and is not specified.'
                };
            }
            if (Operation.isLogical(this.operator) && (!(this.subject instanceof Predicate ||
                this.value instanceof Predicate) || this.subject instanceof Predicate && this.value === undefined)) {
                throw {
                    key: 'INVALID_LOGICAL',
                    msg: 'The predicate does not represent a valid logical expression.'
                };
            }
            retValue = '(' + ((this.subject instanceof Predicate) ? this.subject.serialize() : this.subject) + ' ' + this.operator;
            if (!Operation.isUnary(this.operator)) {
                if (this.value === undefined) {
                    throw {
                        key: 'INVALID_VALUE',
                        msg: 'The value was required but was not defined.'
                    };
                }
                retValue += ' ';
                if ($.type(this.value) === 'string') {
                    retValue += '\'' + this.value + '\'';
                } else if ($.type(this.value) === 'number' || typeof this.value === 'boolean') {
                    retValue += this.value;
                } else if (this.value instanceof Predicate) {
                    retValue += this.value.serialize();
                } else if ($.type(this.value) === 'date') {
                    retValue += 'datetimeoffset\'' + this.value.toISOString() + '\'';
                } else {
                    throw {
                        key: 'UNKNOWN_TYPE',
                        msg: 'Unsupported value type: ' + (typeof this.value)
                    };
                }

            }
            retValue += ')';
        }
        return retValue;
    };
    return this;
};
/**
 * Return a logical expression using the specified predicates and the specified operation.  If more than two
 * predicates or config objects are defined they will continue to be chained with the specified logial operator
 * into a compound expression.
 *
 * @param {Operation} op (optional) The operation.
 * @param {Predicate[]|Object[]} predicates The predicates to serve as the values in the logical expression.
 *
 * @return {Predicate} A new predicate representing the logical expression.
 */
Predicate.logical = function (op) {
    if (op === null || !Operation.isLogical(op)) {
        throw {
            key: 'INVALID_LOGICAL',
            msg: 'The predicates are not valid for a logial expression.'
        };
    }
    var left = $.isArray(arguments[1]) ? arguments[1].shift() : arguments[1];
    var args = $.isArray(arguments[1]) ? arguments[1] : Array.prototype.slice.apply(arguments).slice(2, arguments.length);
    var len = args.length;
    for (var i = 0; i < len; i++) {
        var right = args[i];
        left = new Predicate({
            subject: left,
            operator: op,
            value: right
        });
    }
    return left;
};
/**
 * Generate a like predicate expression for the specified field and value.
 *
 * @param (String} field the field.
 * @param (Object) value the object to compare to
 *
 * @return {Predicate} a like expression predicate.
 */
Predicate.like = function (field, value) {
    var p = new Predicate({
        subject: 'substringof(\'' + value + '\',' + field + ')',
        operator: Operation.EQUALS,
        value: true
    });
    return p;
};

Predicate.contains = function(field, value) {
    var p = new Predicate({
        subject: 'contains(' + field + ', \'' + value + '\')',
        operator: Operation.EQUALS,
        value: true
    });
    return p;
};

