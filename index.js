const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/config')

app.listen(config.PORT, () => {
    logger.log(`Server running on port ${config.PORT}`)
})