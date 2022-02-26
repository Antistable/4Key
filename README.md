# 4Key
 A web rhythm game made with Cocos Creator 3.4 & Firebase

![Preview](https://user-images.githubusercontent.com/82582936/155836839-bac4175e-f56a-48d0-ae34-5fec52d34815.png)

Due to Cocos Creator 3.4.1 doesn't support firebase, I use `eval("try{MyFirebaseFunc()}catch(){}")` in the code and add the browser-end code below to `index.html` after building:

```html
<head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand&display=swap"
        rel="stylesheet">
    <style>
        body {
            background-color: black;
        }

        #list {
            width: 300px;
            height: 400px;
            background-color: aliceblue;
            overflow-y: scroll;
            position: absolute;
            left: 0%;
            right: 0%;
            top: 0%;
            bottom: 0%;
            margin: auto;
            border-radius: 10px;
        }

        .rank {
            width: 90%;
            height: 100px;
            background-color: rgba(255, 239, 219, 0.2);
            margin: auto;
            border-image: linear-gradient(to right, #9958e4, #527aca) 1;
            border-style: solid;
            border-width: 2px;
            position: relative;
        }

        .rank img {
            position: absolute;
            width: 50px;
            height: 50px;
            left: 10px;
            top: 10px;
        }

        .rank p {
            position: absolute;
            left: 8px;
            top: 50px;
            font-size: 20px;
            font-family: 'Quicksand', sans-serif;
            font-weight: bolder;
        }

        .rank a {
            position: absolute;
            left: 100px;
            top: 10px;
            font-size: 30px;
            font-family: 'Quicksand', sans-serif;
            line-height: 30px;
        }
    </style>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.20.0/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.20.0/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/7.20.0/firebase-analytics.js"></script>
</head>

<body>
    <div id="list">
        <svg onclick="closeList()" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
            fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none" />
            <path
                d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
        </svg>
        <br>
        <div id="container">

        </div>
        <br>
    </div>
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyBP0Z9U6NtSzV_ew6aHGgeu0pOIfqiOJik",
            authDomain: "googlify-dev.firebaseapp.com",
            projectId: "googlify-dev",
            storageBucket: "googlify-dev.appspot.com",
            messagingSenderId: "579802640871",
            appId: "1:579802640871:web:9b68fde02c2a2f7fd44d42",
            measurementId: "G-620WX5SRK9"
        };
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        var path;
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                path = firebase.firestore().collection("4k").doc(user.uid);
                path.get().then(doc => {
                    if (!doc.exists) {
                        path.set({
                            score: 0,
                            name: user.displayName,
                            photo: user.photoURL
                        });
                    }
                });
            } else {
                window.location.href = "../";
            }
        });

        closeList();

        function updateScore(newScore) {
            path.get().then(doc => {
                const score = doc.data().score;
                if (score < newScore) {
                    path.update({
                        score: newScore
                    })
                }
            });
        }

        function closeList() {
            $("#list").hide();
            $("#container").empty();
        }

        function showList() {
            firebase.firestore().collection("4k").orderBy("score", "desc").get().then(collection => {
                let i = 1;
                collection.forEach((doc) => {
                    const data = doc.data();
                    createRank(data.name, data.score, data.photo, i++);
                });
            });
            $("#list").show();
        }

        function createRank(name, score, photo, number) {
            const rank = document.createElement("div");
            rank.className = "rank";

            const img = document.createElement("img");
            img.src = photo;

            const a = document.createElement("a");
            a.innerText = `${"0".repeat(score ? 6 - Math.floor(Math.log10(score)) : 6)}${score} #${number}`;

            const p = document.createElement("p");
            p.innerText = name;

            rank.appendChild(img);
            rank.appendChild(p);
            rank.appendChild(a);

            document.getElementById("container").appendChild(rank);
            document.getElementById("container").appendChild(document.createElement("br"));
        }
    </script>
</body>
```
