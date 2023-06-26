module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [

        [
            'react-native-reanimated/plugin', {
                relativeSourceLocation: true,
            },
        ],
        [
            "babel-plugin-inline-import",
            {
                "extensions": [".svg"]
            }
        ]
    ],
};
