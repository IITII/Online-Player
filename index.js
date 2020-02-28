const Sequelize = require('sequelize');
const BodyParser = require('koa-bodyparser');
const Koa = require('koa');
const Router = require('koa-router');
const log4js = require('koa-log4');
const serve = require('koa-static');
const config = require('./config.json');
const convert = require('koa-convert');
const path = require('path');

const logger = log4js.getLogger(config.loggerName);
const sequelize = new Sequelize(config.movie_stu_nchu_edu_cn_orm);
const app = new Koa();
const router = Router();

logger.level = config.loggerLevel;
let customError = {
    error: false,
    errorCode: 500,
    errorInfo: ""
};

const Request = sequelize.define('Movie', {
    MovieID: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true},
    MovieName: {type: Sequelize.STRING, allowNull: true},
    MoviePic: {type: Sequelize.STRING, allowNull: true},
    MovieInfo: {type: Sequelize.STRING, allowNull: true},
    MovieURL: {type: Sequelize.STRING, allowNull: true},
    MovieStar: {type: Sequelize.FLOAT, allowNull: true},
    MovieScore: {type: Sequelize.INTEGER, allowNull: true},
    MovieScoreNumber: {type: Sequelize.INTEGER, allowNull: true},
    MoviePlayTimes: {type: Sequelize.INTEGER, allowNull: true},
    CreateDate: {type: Sequelize.DATE, allowNull: true},
    UpdateDate: {type: Sequelize.DATE, allowNull: true},
    CreateUID: {type: Sequelize.STRING, allowNull: true},
    CreateName: {type: Sequelize.STRING, allowNull: true},
    LastUpdateUID: {type: Sequelize.STRING, allowNull: true},
    Display: {type: Sequelize.BOOLEAN, allowNull: true},
    MovieAreaID: {type: Sequelize.INTEGER, allowNull: true},
    Director: {type: Sequelize.STRING, allowNull: true},
    Scenarist: {type: Sequelize.STRING, allowNull: true},
    LeadingRole: {type: Sequelize.STRING, allowNull: true},
    Language: {type: Sequelize.STRING, allowNull: true},
    Published: {type: Sequelize.DATE, allowNull: true},
    Mins: {type: Sequelize.INTEGER, allowNull: true},
    BBStid: {type: Sequelize.INTEGER, allowNull: true}
});

app.use(convert(BodyParser({
    encode: 'utf-8',
    formLimit: '12mb',
    jsonLimit: "7mb",
    textLimit: "5mb",
    onerror: (err, ctx) => {
        ctx.response.body = err
    }
})));
app.use(router.routes());

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './public';
app.use(log4js.koaLogger(log4js.getLogger('http'), {level: config.loggerLevel}));
app.use(serve(path.join(__dirname, staticPath)));
app.listen(config.port, () => {
    logger.info('Listening on port: ' + config.port)
});

async function connectDB() {
    /** 连接数据库 */
    logger.info('Connecting to database...');
    await sequelize.authenticate()
        .then(async () => await logger.debug('Connected!'))
        .catch(ConnectionRefusedError => {
            logger.log("数据库连接失败！\n请检查数据库是否已启动！");
            logger.debug(ConnectionRefusedError);
            //process.exit(1);
            customError.error = true;
        })
        .catch(ConnectionError => {
            logger.info("目标主机访问失败！");
            logger.debug(ConnectionError);
            //process.exit(1);
            customError.error = true;
        })
        .catch(AccessDeniedError => {
            logger.info("数据库访问失败！\n请检查用户名和密码！\n请检查目标主机的目标数据库是否存在或是否有访问权限！");
            logger.debug(AccessDeniedError);
            //process.exit(1);
            customError.error = true;
        })
        .catch(error => {
            logger.debug(error);
            //process.exit(1);
            customError.error = true;
        });
}

function checkIdentify(ip) {
    config.requestIP.some(value => {
        return value === ip;
    });
}

router.post('/', async (ctx, next) => {
    logger.info(ctx.request.body);
    if (ctx.request.body.hasOwnProperty('MovieID') && !(ctx.request.body.MovieID === "")) {
        //if (checkIdentify(ctx.ip)) {
        if (customError.error) {
            ctx.res.status = customError.errorCode;
            ctx.res.body = customError.errorInfo;
            return;
        }
        let movieId = ctx.request.body.MovieID;
        try {
            if (Number.parseInt(movieId) < 1) {
                ctx.response.status = 400;
                ctx.response.body = "Bad Request!";
            }
        } catch (e) {
            ctx.response.status = 403;
            ctx.response.body = "Forbidden!";
        }
        let request = await Request.findByPk(movieId);
        if (request != null) {
            ctx.response.status = 200;
            ctx.response.body = request.MovieURL;
        } else {
            ctx.response.status = 404;
            ctx.response.body = "MovieId not found! ";
        }
    } else {
        ctx.response.status = 404;
        ctx.response.body = "Not right request param!!! ";
    }
    //}
    // return ctx.request.send(()=>{
    //     "233"
    // });
});
connectDB();