var arrangement = [1, 3, 5, 7];
console.log(esta_ordenado(arrangement));
function esta_ordenado(arrnum) {
    for (var index = 0; index < arrangement.length; index++) {
        if (arrnum[index] > arrnum[index + 1]) {
            return false;
        }
    }
    return true;
}
