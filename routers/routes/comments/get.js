var commentColl = mongoConfig.comments.collName;


/**
 * Get comments for the given restaurant id 
 */
module.exports = function(req, res) {
    db.collection(commentColl).findOne({
        id: req.params.id
    }, function(err, result) {
        if (!err) {
            helperResp.success(res, result || { comments: [] })
        } else {
            helperResp.serverError(res);
        }
    })
}