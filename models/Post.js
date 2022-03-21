
class Post {
    constructor(data) {
        this.data = data
        this.errors = []
    }
    async criar(){
        try {
            return this.data
        } catch (error) {
            throw error
        }
    }
}

module.exports = Post