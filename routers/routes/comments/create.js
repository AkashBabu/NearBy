var commentColl = mongoConfig.comments.collName;


/**
 * It creates a new document if not already present,
 * It removes comments by a user if already present,
 * it updates the new comment
 */
module.exports = function(req, res) {
    var body = req.body || {};
    var comment = {
        name: req.user.name,
        userId: req.user._id,
        title: body.title,
        comment: body.comment
    }

    db.collection(commentColl).update({
        id: body.id
    }, {
        $pull: {
            comments: {
                userId: req.user._id
            }
        }
    }, {
        upsert: true
    }, function(err, result) {
        if (!err) {
            db.collection(commentColl).update({
                id: body.id
            }, {
                $push: {
                    comments: comment
                }
            }, {
                upsert: false,
                multi: false
            }, function(err, result1) {
                helperResp.handleResult(res, err, result1);
            })
        } else {
            helperResp.serverError(res);
        }
    })
}