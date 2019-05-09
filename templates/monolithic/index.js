const app = require('./src/config/express');

app.listen(app.get('port'), () => console.log(`Server is running at port ${app.get('port')}`));
