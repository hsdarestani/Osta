(() => {
  const form = document.getElementById('aiComposer');
  if (!form) return;
  const prompt = document.getElementById('aiPrompt');
  const send = document.getElementById('aiSend');
  const messages = document.getElementById('chatMessages');
  const meta = document.getElementById('aiMeta');
  const model = document.getElementById('aiModel');
  const fa = new Intl.NumberFormat('fa-IR');

  function addMessage(role, text, cost) {
    const empty = messages.querySelector('.chat-empty');
    if (empty) empty.remove();
    const wrap = document.createElement('div');
    wrap.className = 'chatmsg ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'chatbubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    if (role === 'assistant' && cost) {
      const small = document.createElement('small');
      small.textContent = fa.format(cost) + ' تومان';
      wrap.appendChild(small);
    }
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function setBusy(busy) {
    send.disabled = busy;
    prompt.disabled = busy;
    if (model) model.disabled = busy;
    send.textContent = busy ? 'در حال پردازش…' : 'ارسال';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = prompt.value.trim();
    if (!text || send.disabled) return;

    addMessage('user', text);
    prompt.value = '';
    setBusy(true);
    meta.textContent = 'در حال اجرای مدل و محاسبه هزینه…';

    try {
      const response = await fetch('/dashboard/ai/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          _csrf: form.dataset.csrf,
          conversation_id: form.dataset.conversation || null,
          mode: form.dataset.mode || 'chat',
          model: model ? model.value : null,
          prompt: text
        })
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || 'درخواست ناموفق بود.');

      addMessage('assistant', data.answer || 'پاسخی دریافت نشد.', data.charged_toman);
      form.dataset.conversation = data.conversation_id || '';
      const url = new URL(window.location.href);
      if (data.conversation_id) {
        url.searchParams.set('c', data.conversation_id);
        history.replaceState({}, '', url);
      }
      meta.textContent =
        'مدل: ' + data.model +
        ' · ورودی: ' + fa.format(data.input_tokens) +
        ' · خروجی: ' + fa.format(data.output_tokens) +
        ' · هزینه: ' + fa.format(data.charged_toman) + ' تومان' +
        ' · زمان: ' + fa.format(data.latency_ms) + ' ms';
    } catch (error) {
      addMessage('assistant', 'خطا: ' + (error?.message || 'دوباره تلاش کن.'));
      meta.textContent = 'درخواست انجام نشد و بابت پاسخ ناموفق هزینه‌ای ثبت نشد.';
    } finally {
      setBusy(false);
      prompt.focus();
    }
  });

  prompt.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  messages.scrollTop = messages.scrollHeight;
})();