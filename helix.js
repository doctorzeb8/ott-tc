var n = process.argv.length == 3 ? parseInt(process.argv[2]) : 2;
if (isNaN(n)) process.exit();

var l = 2 * n - 1;
var m = new Array();

console.log('In:')
for (var i=0; i<l; i++) {
    var r = new Array();
    for (var j=0; j<l; j++) {
        r.push(Math.floor(Math.random() * 10));
    }
    m.push(r);
    console.log(r);
}


var f = true;
var z = 1;
var c = n - 1;
var x = y = c;
var v = [m[c][c]];

for (var k=1; k<Math.pow(l, 2); k++) {
    if (f && x > c - z) {
        x -= 1;
    } else {
        if (f && y < c + z) {
            y += 1;
        } else {
            f = false;
            if (x < c + z) {
                x += 1;
            } else {
                if (y > c - z) {
                    y -= 1;
                } else {
                    f = true;
                    x -= 1;
                    z += 1;
                }
            }
        }
    }
    v.push(m[y][x]);
}

console.log('Out:');
console.log(v);
