import nano from "nano";
import {IUser} from "./interfaces/user.interface";

export let couch: nano.ServerScope;
export let usersDb: nano.DocumentScope<IUser>;

export const chats_database = "chats";
export const games_database = "games";
export const rounds_database = "rounds";
export const teams_database = "teams";
export const users_database = "users";
export const vocabularies_database = "vocabularies";

interface CouchDBViewMapFunction {
  (doc: any): void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function emit(field: string, doc: any): void {

}

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
  for (const name of databases) {
    await couch.db.get(name, async (err) => {
        if (err) {
          if (err.statusCode === 404) {
            await couch!.db.create(name);
            console.log(`Database ${name} was created.`)
          } else {
            console.error('Error checking database:', err);
          }
        }
      }
    );
  }
  usersDb = couch.use(users_database);

  const userViews = {
    _id: '_design/views',
    views: {
      byUsername: {
        map: function (doc) {
          if (doc.username) {
            emit(doc.username, doc);
          }
        } as CouchDBViewMapFunction,
      },
    },
  };
  await initViews(usersDb, userViews);

}

async function initViews(database: nano.DocumentScope<any>, view: any) {
  try {
    await database.get("_design/views");
  } catch (e: any) {
    await database.insert(view)
  }
}
