import express from 'express';
import request from 'request';
import fs from 'fs';
import path from 'path';

const xmlParser = require('fast-xml-parser');
require('dotenv').config();

import { retrieveSoundBox, retrieveRecentPosts } from '../controllers/post.controller';
import { retrievePhotosInBoard } from '../controllers/photo.controller';
import { retrieveRecentComments } from '../controllers/comment.controller';

const router = express.Router();

router.get('/soundbox', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveSoundBox()
        .then((post) => {
            res.json(post)
        })
        .catch((err) => {
            console.error(err);
            res.status(401).json({
                error: 'Retrieve Soundbox fail'
            });
        })
})

router.get('/posts', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveRecentPosts()
        .then((posts) => {
            res.json(posts)
        })
        .catch((err) => {
            console.error(err);
            res.status(401).json({
                error: 'Retrieve Posts fail'
            });
        })
})

router.get('/memory', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrievePhotosInBoard('brd31', 9, 0)
        .then((photos) => {
            res.json(photos)
        })
        .catch((err) => {
            console.error(err);
            res.status(401).json({
                error: 'Retrieve Photos fail'
            });
        })
})

router.get('/astrophoto', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrievePhotosInBoard('brd32', 9, 0)
        .then((photos) => {
            res.json(photos)
        })
        .catch((err) => {
            console.error(err);
            res.status(401).json({
                error: 'Retrieve Photos fail'
            });
        })
})

router.get('/comments', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);
    retrieveRecentComments()
        .then((comments) => {
            res.json(comments)
        })
        .catch((err) => {
            console.error(err);
            res.status(401).json({
                error: 'Retrieve Comments fail'
            });
        })
})

router.get('/riseset', (req, res) => {
    console.log(`[GET] ${req.baseUrl + req.url}`);

    let url = 'http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo';
    const today = new Date();
    let year = today.getFullYear().toString();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    let dayformat = `${year}${month}${day}`;

    try {
        if(!(fs.existsSync(path.join('.', 'riseset')))) {
            fs.mkdirSync(path.join('.', 'riseset'))
        }            
    } catch (err) {
        console.error(err)
    }

    try {
        const riseSetJsonPath = path.join('.', 'riseset', `${dayformat}.json`)

        if(fs.existsSync(riseSetJsonPath)) {
            let riseSetInfo = fs.readFileSync(riseSetJsonPath, 'utf8');
            res.json(JSON.parse(riseSetInfo))
        }
        else {
            let queryParams = '?' + encodeURIComponent('ServiceKey') + '=' + process.env.RISESET_SERVICE_KEY;
            queryParams += '&' + encodeURIComponent('locdate') + '=' + encodeURIComponent(dayformat);
            queryParams += '&' + encodeURIComponent('location') + '=' + encodeURIComponent('서울');
        
            request.get(url + queryParams, (err, response, body) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        success: false,
                        code: 0
                    });
                }
                else if (!xmlParser.validate(body)) {
                    console.error('xml parse error');
                    res.status(500).json({
                        success: false,
                        code: 0
                    });
                }
                else {
                    let data = xmlParser.parse(body);
                    let item = {};
                    if (data.response
                        && data.response.body
                        && data.response.body.items
                        && data.response.body.items.item) {
        
                        item = data.response.body.items.item;
                    }
                    const riseSetInfo = {
                        sunrise: item.sunrise,
                        sunset: item.sunset,
                        moonrise: item.moonrise,
                        moonset: item.moonset,
                        astm: item.astm,
                        aste: item.aste
                    }
                    fs.writeFileSync(riseSetJsonPath, JSON.stringify(riseSetInfo), 'utf8');
                    res.json(riseSetInfo);
                }
            })
        }
    } catch (err) {
        console.error(err)
    }



    
})

export default router;