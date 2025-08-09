# Chat API Troubleshooting Guide

## 🐛 Current Issue
`POST http://localhost:3000/api/chat net::ERR_EMPTY_RESPONSE`

This error indicates the server is not returning any response, which could be due to several issues.

## 🔍 Debugging Steps

### 1. Test AI API Directly
Visit the chat page and use the "Test AI API" button to check if the Google AI integration is working.

**Expected Results:**
- ✅ Success: API key is working, Google AI is accessible
- ❌ Error: API key issue, network problem, or Google AI service issue

### 2. Test Chat API
Use the "Test Chat API" button to test the full chat endpoint.

**Expected Results:**
- ✅ Success: Full chat pipeline is working
- ❌ Error: Issue in chat API route or streaming

### 3. Check Server Logs
Look at the server console for detailed logging:

```bash
# In your terminal running the dev server
npm run dev
# or
pnpm dev
```

**Look for:**
- `=== Chat API Called ===`
- Environment and API key status
- Request body details
- Error messages and stack traces

## 🔧 Common Issues & Solutions

### Issue 1: Google AI API Key Not Working
**Symptoms:**
- "Google AI API key not configured" error
- "API Key exists: false" in logs

**Solutions:**
1. Check `.env.local` file has the correct key:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```
2. Restart the development server after adding the key
3. Verify the API key is valid at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Issue 2: Network/Firewall Issues
**Symptoms:**
- Timeout errors
- Connection refused
- Empty responses

**Solutions:**
1. Check internet connection
2. Try from a different network
3. Check if corporate firewall is blocking Google AI APIs
4. Test with a VPN if needed

### Issue 3: Request Format Issues
**Symptoms:**
- "Invalid messages format" error
- Malformed request body in logs

**Solutions:**
1. Check the useChat hook is properly configured
2. Verify messages array format
3. Check for JSON parsing errors

### Issue 4: Streaming Issues
**Symptoms:**
- API works but no streaming response
- Partial responses
- Connection drops

**Solutions:**
1. Check if streaming is supported in your environment
2. Try non-streaming response for testing
3. Check network stability

## 🧪 Testing Checklist

### ✅ Basic Tests
- [ ] API key is set in `.env.local`
- [ ] Development server is running
- [ ] No console errors on page load
- [ ] Test AI API button works
- [ ] Test Chat API button works

### ✅ Advanced Tests
- [ ] Server logs show API calls
- [ ] Request body is properly formatted
- [ ] Google AI API responds
- [ ] Streaming works correctly
- [ ] Error handling works

## 🔄 Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop the dev server (Ctrl+C)
# Then restart
pnpm dev
```

### Fix 2: Clear Next.js Cache
```bash
rm -rf .next
pnpm dev
```

### Fix 3: Check Environment Variables
```bash
# In your terminal
echo $GOOGLE_GENERATIVE_AI_API_KEY
# Should show your API key
```

### Fix 4: Test with cURL
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

## 📊 Expected API Flow

1. **Frontend** → POST `/api/chat` with messages
2. **API Route** → Validates request and API key
3. **Google AI** → Processes request with Gemini model
4. **Streaming** → Response streams back to frontend
5. **Frontend** → Displays response in chat interface

## 🚨 Emergency Fallback

If the Google AI integration continues to fail, you can temporarily use a mock response:

```typescript
// In /api/chat/route.ts - temporary fallback
return new Response(
  `Based on the physician discharge data, here are the key insights:

• **Overall Performance**: The average morning discharge rate is 31.2% across 22 physicians
• **Top Performers**: Ahmed, M leads with 45.2% morning discharge rate
• **Improvement Needed**: The hospital is below the 40% industry benchmark
• **Peak Activity**: Most discharges occur at 3 PM

**Recommendations:**
1. Focus on increasing morning discharges (before noon)
2. Learn from top performers like Ahmed, M and Baltag, E
3. Implement workflow improvements for earlier discharge times

Would you like me to analyze any specific physician or provide more detailed recommendations?`,
  {
    headers: {
      'Content-Type': 'text/plain',
    },
  }
);
```

## 📞 Next Steps

1. **Test the AI API** using the test buttons
2. **Check server logs** for detailed error information
3. **Verify API key** is working with Google AI Studio
4. **Try the troubleshooting steps** above
5. **Report specific error messages** if issues persist

The enhanced logging and test components should help identify exactly where the issue is occurring!