fetch('https://your-r2-bucket-url/posts/post1.json')
    .then(res => res.json())
    .then(data => {
        document.getElementById('title').textContent = data.title;
        document.getElementById('content').innerHTML = data.content;
    });
