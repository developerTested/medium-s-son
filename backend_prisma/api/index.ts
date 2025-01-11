import { app, PORT } from "../src/app";

app.listen(PORT, () => {
    console.log(`Medium backend is running on http://localhost:${PORT|| 3000} in ${app.settings.env} mode `);
})