module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "linebreak-style": 0,
        "object-shorthand": ["error", "never"],
        "no-underscore-dangle": ["error", {
            "allow": ["_id"]
        }],
        "no-param-reassign": ["error", {
            "props": true,
            "ignorePropertyModificationsFor": ["comment", "res"]
        }],
        "no-use-before-define": [2, {
            "functions": false,
            "classes": true
        }],
        "no-console": ["error", {
            allow: ["log"]
        }]
    },
};