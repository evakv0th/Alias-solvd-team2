import nano from "nano";

export let couch: nano.ServerScope | undefined;

export const chats_database = "chats";
export const games_database = "games";
export const rounds_database = "rounds";
export const teams_database = "teams";
export const users_database = "users";
export const vocabularies_database = "vocabularies";

export async function couchdbInit() {
    const databases = [
        chats_database,
        games_database,
        rounds_database,
        teams_database,
        users_database,
        vocabularies_database
    ];
    const host = process.env.DATABASE_HOST!;
    const port = process.env.DATABASE_PORT!;
    const user = process.env.COUCHDB_USER!
    const password = process.env.COUCHDB_PASSWORD!
    const config = `http://${user}:${password}@${host}:${port}`
    couch = nano(config);
    databases.forEach(async (name) =>
        await couch?.db.get(name, async (err) => {
                if (err) {
                    if (err.statusCode === 404) {
                        await couch!.db.create(name);
                        console.log(`Database ${name} was created.`)
                    } else {
                        console.error('Error checking database:', err);
                    }
                }
            }
        ));
}
