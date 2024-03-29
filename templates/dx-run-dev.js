// Used to spin up a docker database service and then run a local instance of divbloxjs
const { exit } = require("process");
const exec = require("child_process").exec;

console.log("Starting docker db service...");
exec("docker compose up", (err, stdout, stderr) => {
    if (err) {
        console.error(err);
    }
    console.log(stdout);
});

const checkIsDockerRunning = () => {
    console.log("Waiting for docker db service...");
    exec("docker ps", (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            exit(1);
        }
        if (stdout.indexOf("divblox_[appName]_dev_database") !== -1) {
            console.log("Docker db service started!");
            console.log("Starting divblox...");

            setTimeout(() => {
                startDx();
            }, 2000);
        } else {
            setTimeout(() => {
                checkIsDockerRunning();
            }, 2000);
        }
    });
};

checkIsDockerRunning();

let firstFail = true;

const startDx = () => {
    const { fork } = require("child_process");

    const dxForked = fork("./bin/dx-entry-point.js");

    dxForked.on("exit", function (code, signal) {
        if (firstFail) {
            firstFail = false;
            console.log("Docker db service might not be ready. Retrying...");

            setTimeout(() => {
                startDx();
            }, 10000);
        } else {
            console.log("child process exited with " + `code ${code} and signal ${signal}`);
            exit(1);
        }
    });

    dxForked.on("data", (data) => {
        console.log(`Data ${data}`);
    });

    dxForked.on("message", (msg) => {
        console.log("Message from child", msg);
    });
};
