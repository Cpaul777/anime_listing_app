import { Client, Databases, Query, TablesDB, ID } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setDevKey()

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, anime) => {
    // 1. Use appwrite SDK to check if the  search term already exist
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID, 
            tableId: TABLE_ID, 
            queries:[Query.equal('searchTerm', searchTerm)]});

        // 2. If it exist, update the count
        if(result.total > 0){
            console.log("Im updating a row")
            result.rows.forEach(async (row) => {
                await tablesDB.updateRow({databaseId: DATABASE_ID, tableId: TABLE_ID, rowId: row.$id, data:{ count: row.count + 1,}})
            })

        }
        // 3. If it doesnt exist, create a new search term and set the count as 1
        else{
            console.log("Im creating a new row")
            await tablesDB.createRow({ databaseId: DATABASE_ID, tableId: TABLE_ID, rowId: ID.unique(),data: {
                searchTerm, 
                count: 1, 
                anime_id: parseInt(anime.id), 
                poster_url: anime.attributes.posterImage.original, }})
        }

    } catch (error) {
        console.error(error)
    }
    
}

export const getTrendingAnime = async () => {
    try {
        const result = await tablesDB.listRows({databaseId: DATABASE_ID, tableId: TABLE_ID, queries:[
            Query.limit(10),
            Query.orderDesc('count')
        ]})

        return result.rows
    } catch (error) {
        console.error(error)
    }
}
