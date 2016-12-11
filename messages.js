const redis = require('redis');
const uuid = require('uuid/v4');

const db = redis.createClient();
const q = redis.createClient();

const id = uuid();
var handler = false;


function push() {
    setInterval(function() {
        var msg = uuid();
        //console.log('>', msg);
        db.rpush('generated', msg);
    }, 500);
}


function pull() {
    q.brpop('generated', 0, function(err, res) {
        if (!err && res) {
            var target = Math.random() <= 0.05 ? 'wrong' : 'processed';
            //console.log('<', res[1]);
            db.rpush(target, res[1]);
            handler && pull();
        }
    })
}


function check() {
    db.get('main', function(err, res) {
        if (err) {
            console.log(err);
            process.exit();
        }
        if (res == null) {
            handler = false;
            q.end(true);
            db.setex('main', 1, id);
            push();
        } else if (res == id) {
            db.expire('main', 1);
        } else if (!handler) {
            handler = true;
            pull();
        }
    });
    setTimeout(check, 500);
}


if (process.argv.length == 2) {
    db.on('connect', check);
} else if (process.argv[2] == '-e') {
    db.on('connect', function() {
        db.lrange('wrong', 0, -1, function(err, res) {
            if (!err && res.length) {
                console.log(res);
                db.del('wrong', process.exit);
            } else {
                process.exit();
            }
        })
    })    
}
