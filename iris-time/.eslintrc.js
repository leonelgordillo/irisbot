// module.exports = {
//     "env": {
//         "es6": true,
//         "node": true
//     },
//     "extends": "eslint:recommended",
//     "globals": {
//         "Atomics": "readonly",
//         "SharedArrayBuffer": "readonly"
//     },
//     "parserOptions": {
//         "ecmaVersion": 2018,
//         "sourceType": "module"
//     },
//     "rules": {
//     }
// };

module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};