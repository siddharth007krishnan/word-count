set -e

./ccwc.js ./test.txt
wc ./test.txt

./ccwc.js -l ./test.txt
wc -l ./test.txt

./ccwc.js -w ./test.txt
wc -w ./test.txt

./ccwc.js -c ./test.txt
wc -c ./test.txt

./ccwc.js -m ./test.txt
wc -c ./test.txt

./ccwc.js -b ./test.txt

./ccwc.js -l -m -c -w ./test.txt
wc -l -m -c -w ./test.txt