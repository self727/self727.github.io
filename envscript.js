const COS_URL = 'https://web-1256805236.cos.ap-guangzhou.myqcloud.com/env.html';

async function loadEnvPage() {
    try {
        const res = await fetch(COS_URL);
        const html = await res.text();

        // 提取 <body> 内容
        const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyContent = bodyMatch ? bodyMatch[1] : html;

        document.getElementById('content').innerHTML = bodyContent;

        // 设置所有 section 可编辑
        document.querySelectorAll('#content section').forEach(sec => {
            sec.setAttribute('contenteditable', 'true');
        });
    } catch (err) {
        document.getElementById('content').textContent = '加载失败，请检查 COS 配置';
        console.error(err);
    }
}

async function saveToCOS() {
    const editedContent = document.getElementById('content').innerHTML;
    const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>有瓜故事会 · 环境链接汇总</title>
</head>
<body>
${editedContent}
</body>
</html>`;

    try {
        const res = await fetch(COS_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'text/html' },
            body: fullHtml
        });
        alert(res.ok ? '✅ 保存成功！' : '❌ 保存失败，请检查权限');
    } catch (err) {
        alert('❌ 保存失败：' + err.message);
    }
}

document.getElementById('saveBtn').onclick = saveToCOS;
loadEnvPage();
