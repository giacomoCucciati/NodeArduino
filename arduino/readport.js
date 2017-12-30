process.on('message', (msg) => {
  console.log('Message from parent:', msg);
});

let counter = 0;

setInterval(() => {
    // Do something
    console.log('Child process is doing something...');
    process.send({ counter: counter++ });
}, 5000);
