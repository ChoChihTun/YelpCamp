module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "linebreak-style": 0,
        "object-shorthand": ["error", "never"],
        "no-underscore-dangle": ["error", {
            "allow": ["_id"]
        }],
        "no-param-reassign": ["error", {
            "props": true, "ignorePropertyModificationsFor": ["comment"]
            }],
    },
};