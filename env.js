// env.js

const INIT_URL = 'https://rough-wind-37be.dyw1618.workers.dev/env.json';
const PRESIGN_ENDPOINT = 'https://cos-presign-worker.dyw1618.workers.dev/presign?key=env.json&type=put';

export async function readEnvJson() {
    const status = document.getElementById('status');
    const editor = document.getElementById('editor');
    try {
        status.classList.remove('error');
        status.textContent = '正在从 Worker 加载...';
        const res = await fetch(INIT_URL);
        if (!res.ok) throw new Error(`读取失败：${res.status}`);
        const text = await res.text();
        editor.value = text;
        status.textContent = '读取成功';
    } catch (err) {
        status.classList.add('error');
        status.textContent = '读取失败：' + err.message;
    }
}

export async function bumpVersionAndSave() {
    const editor = document.getElementById('editor');
    const status = document.getElementById('status');
    try {
        status.classList.remove('error');
        const json = JSON.parse(editor.value);
        const oldVersion = json.version || '0.0.0';
        const parts = oldVersion.split('.').map(n => parseInt(n));
        parts[2] += 1;
        json.version = parts.join('.');
        const newContent = JSON.stringify(json, null, 2);
        editor.value = newContent;

        status.textContent = '获取签名中...';
        const res = await fetch(PRESIGN_ENDPOINT);
        const { url } = await res.json();

        status.textContent = '写入中...';
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: newContent,
        });

        if (!putRes.ok) throw new Error(`写入失败：${putRes.status}`);
        status.textContent = `✅ 保存成功，版本已更新为 ${json.version}`;
    } catch (err) {
        status.classList.add('error');
        status.textContent = '保存失败：' + err.message;
    }
}

export function downloadEditorContent() {
    const content = document.getElementById('editor').value;
    const blob = new Blob([content], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'env.json';
    a.click();
}

export function initEditor() {
    window.addEventListener('DOMContentLoaded', readEnvJson);
}
