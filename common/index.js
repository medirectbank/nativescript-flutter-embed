const prompts = require('prompts');
const { execSync } = require('node:child_process');

(async () => {
    const response = await prompts([{
        type: 'text',
        name: 'path',
        message: 'What is the Project Path?',
    },

    {
        type: 'select',
        name: 'action',
        message: 'Select Action',
        choices: [
            { title: 'Install', value: 'install' },
            { title: 'Uninstall', value: 'uninstall' },
        ],
        initial: 0

    }
    ]
    );
    execSync(`node embed.android.mjs --projectPath=${response.path} --action=${response.action}`, { stdio: 'inherit' })
    console.log(response); // => { value: 24 }
})();