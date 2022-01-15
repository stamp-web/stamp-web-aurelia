module.exports = {

    "moduleNameMapper": {
        "^aurelia-binding$": "<rootDir>/node_modules/aurelia-binding"
    },
    "modulePaths": [
        "<rootDir>/src",
        "<rootDir>/node_modules"
    ],
    "moduleFileExtensions": [
        "js",
        "json"
    ],
    "transform": {
        "^.+\\.(css|less|sass|scss|styl|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "jest-transform-stub",
        "^.+\\.(js)$": "babel-jest"
    },
    "testRegex": "\\.spec\\.js$",
    "setupFiles": [
        "<rootDir>/test/jest-pretest.js"
    ],
    "testEnvironment": "jsdom",
    "testTimeout": 8000,
    "collectCoverage": true,
    "resetMocks": true,
    "reporters": [
        "default",
        [
            "jest-junit",
            {
                "outputDirectory": "test/junit",
                "outputName": "TESTS.xml"
            }
        ]
    ],
    "collectCoverageFrom": [
        "src/**/*.js",
        "!**/*.spec.js",
        "!**/node_modules/**",
        "!**/test/**"
    ],
    "coverageDirectory": "<rootDir>/test/coverage",
    "coverageReporters": [
        "json",
        "lcov",
        "html",
        "cobertura"
    ]

}
