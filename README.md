# z0y
零時字引。漢字部件查詢。

線上使用 ONLINE DEMO <http://rawgit.com/g0v/z0y/master/>

use glypheme to search CJK, including Extension A,B,C,D,E

輸入：「木2」 ，找到所有含有「弗」的字，並且剩餘筆劃為 2

深拆：「日月」，只會找到「明」，深拆才會找到「盟」「萌」。

create node_modules/idsdata/decompose.js

    cd node_modules/idsdata
    node gen

rebuild external data-bundle.js whenever node_modules/idsdata is changed.

    build-data

rebuild external react-bundle.js whenever react.js is changed.

    build-react

rebuild bundle.js if any other js is changed.

    build

to develop

		npm i
    watchify -o bundle.js index.js

Serve index.html with webserver, node-webkit , or open directly with browser (file://)


Extension C,D,E font is served by [CHIKAGE](https://github.com/g0v/chikage)

[Slide](https://docs.google.com/presentation/d/16MzEnhGiWYH2e5WMudW6Sc49BTWDf1_aicbFMU9nSrU/edit?usp=sharing)

