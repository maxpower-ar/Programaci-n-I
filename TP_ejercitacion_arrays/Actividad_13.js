var arrangement = [1, 2, 3, 4, 5];
// Con push
console.log(invertirconPush(arrangement));
function invertirconPush(arrnum) {
    var inverso = [];
    for (var index = arrangement.length - 1; index >= 0; index--) {
        inverso.push(arrnum[index]);
    }
    return inverso;
}
//Sin push
function invertir(arrnum) {
    var index2 = 0;
    var inverso = [];
    for (var index = arrangement.length - 1; index >= 0; index--) {
        inverso[index2] = arrnum[index];
        index2++;
    }
    return inverso;
}
