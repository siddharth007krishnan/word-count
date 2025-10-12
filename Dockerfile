FROM node:16.13.0

WORKDIR /usr/src/word-count

COPY package.json package-lock.json ./

COPY ./ccwc.js ./ccwc.js
COPY ./ccwc.js ./bin/ccwc.js


COPY ./tests ./tests
COPY ./test.txt ./test.txt
COPY ./wordCountTests.sh ./wordCountTests.sh


RUN npm install
RUN npm test

CMD  ["./bin/ccwc.js", "-w", "./test.txt"]