// const position = require('../warehouse/position');

// const position1 = {
//     positionID: "000033335555",
//     aisleID: "0000",
//     row: "3333",
//     col: "5555",
//     maxWeight: 500,
//     maxVolume: 600,
//     occupiedWeight: 0,
//     occupiedVolume: 0
// }

// const position2 = {
//     positionID: "000033336666",
//     aisleID: "0000",
//     row: "3333",
//     col: "6666",
//     maxWeight: 400,
//     maxVolume: 300,
//     occupiedWeight: 0,
//     occupiedVolume: 0
// }

// const position3 = {
//     positionID: "000033337777",
//     aisleID: "0000",
//     row: "3333",
//     col: "7777",
//     maxWeight: 400,
//     maxVolume: 300,
//     occupiedWeight: 0,
//     occupiedVolume: 0
// }

// describe('test position apis', () => {
    
//     before(async () => {
//         await position.deleteAllPositions();
//         await position.storePosition(position1);
//         await position.storePosition(position2);
//     });
    
//     testPosition(position1);
//     testPosition(position2);
//     testNotExistPosition(position3);
//     testPositions();
//     testIsNotTherePosition(position3);
//     testIsTherePosition(position2);
//     testDuplicatedPosition(position1);
//     testDeletePosition(position2);
//     testIsNotTherePosiiton(position2);
//     testModifyPosition(position1);
//     testModifyPositionID(position1);
// });

// async function testPosition(i) {
//     test('get position', async () => {
//         let res = await position.getPosition({ positionID: i.positionID });
//         expect(res).toEqual({
//             positionID: i.positionID,
//             aisleID: i.aisleID,
//             row: i.row,
//             col: i.col,
//             maxWeight: i.maxWeight,
//             maxVolume: i.maxVolume,
//             occupiedWeight: i.occupiedWeight,
//             occupiedVolume: i.occupiedVolume
//         });
//     });
// }

// async function testPositions() {
//     test('get positions', async () => {
//         let res = await item.getPositions();
//         expect(res).toEqual([position1,position2]);
//     });
// }

// async function testNotExistPosition(i) {
//     test('get not inserted position', async () => {
//         let res = await position.getPosition({ positionID: i.positionID });
//         expect(res).toEqual(undefined);
//     });
// }

// async function testDuplicatedPosition(i) {
//     test('duplicated position', async () => {
//         try{
//             await position.storePosition(i);
//         }
//         catch(err){
//             expect(err.toString()).toEqual('Error: SQLITE_CONSTRAINT: UNIQUE constraint failed: POSITION.POSITIONID');   
//         }
//     });
// }

// async function testIsTherePosition(i) {
//     test('position present', async () => {
//         let res = await position.isTherePosition({ positionID: i.positionID });
//         expect(res).toEqual(1);
//     });
// }

// async function testIsNotTherePosition(i) {
//     test('position not present', async () => {
//         let res = await position.isTherePosition({ positionID: i.positionID });
//         expect(res).toEqual(0);
//     });
// }

// async function testDeletePosition(i) {
//     test('delete position', async () => {
//         let res0 = await item.getPosition({ positionID: i.positionID });
//         expect(res0).toEqual({
//             positionID: i.positionID,
//             aisleID: i.aisleID,
//             row: i.row,
//             col: i.col,
//             maxWeight: i.maxWeight,
//             maxVolume: i.maxVolume,
//             occupiedWeight: i.occupiedWeight,
//             occupiedVolume: i.occupiedVolume
//         });
//         let res1 = await position.deletePosition({ positionID: i.positionID });
//         expect(res1).toEqual(undefined);
//         let res2 = await position.getPosition({positionID: i.positionID});
//         expect(res2).toEqual(undefined);
//     });
// }

// async function testModifyPosition(i) {
//     test('modify position', async () => {
//         const modifyPosition = {
//             positionID: "111111111111",
//             newAisleID: "1111",
//             newRow: "1111",
//             newCol: "1111",
//             newMaxWeight: 200,
//             newMaxVolume: 600,
//             newOccupiedWeight: 200,
//             newOccupiedVolume: 100
//         }
//         await position.modifyPosition(modifyItem);
//         let res = await position.getPosition({ positionID: modifyPosition.positionID });
//         expect(res).toEqual({
//             positionID: "111111111111",
//             aisleID: "1111",
//             row: "1111",
//             col: "1111",
//             maxWeight: 200,
//             maxVolume: 600,
//             occupiedWeight: 200,
//             occupiedVolume: 100
//         });
//     });
// }

// async function testModifyPositionID(i) {
//     test('modify positionID', async () => {
//         const modifyPositionID = {
//             positionID: "111111111111",
//             newPositionID: "222222222222"
//         }
//         await position.modifyPositionID(modifyPositionID);
//         let res0 = await position.getPosition({ positionID: modifyPositionID.positionID });
//         let res1 = await position.getPosition({ positionID: modifyPositionID.newPositionID });
//         expect(res1).toEqual({
//             positionID: "222222222222",
//             aisleID: "2222",
//             row: "2222",
//             col: "2222",
//             maxWeight: res0.maxWeight,
//             maxVolume: res0.maxVolume,
//             occupiedWeight: res0.occupiedWeight,
//             occupiedVolume: res0.occupiedVolume
//         });
//     });
// }
