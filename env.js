const COS_JSON_URL = 'https://web-1256805236.cos.ap-guangzhou.myqcloud.com/env.json';

async function loadJSON() {
    try {
        const res = await fetch(COS_JSON_URL);
        const json = await res.json();
        document.getElementById('editor').value = JSON.stringify(json, null, 2);
    } catch (err) {
        document.getElementById('editor').value = '❌ 加载失败，请检查 COS 配置或文件是否存在';
        console.error(err);
    }
}

async function saveJSON() {
    const raw = document.getElementById('editor').value;
    try {
        JSON.parse(raw); // 验证 JSON 格式
        const res = await fetch(COS_JSON_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: raw
        });
        alert(res.ok ? '✅ 保存成功！' : '❌ 保存失败，请检查权限');
    } catch (err) {
        alert('❌ JSON 格式错误，请检查内容');
    }
}

document.getElementById('saveBtn').onclick = saveJSON;
loadJSON();
