import requests
import execjs
import json

url = 'https://www.iwencai.com/unifiedwap/unified-wap/v2/result/get-robot-data'
header = {
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br, zstd",
    "accept-language": "zh-CN,zh;q=0.9",
    "connection": "keep-alive",
    "content-type": "application/x-www-form-urlencoded",
    "cookie": "chat_bot_session_id=229534a11a11eb5a5d770dd08d1aa819; other_uid=Ths_iwencai_Xuangu_1txrnul23unlwnuxei986b713ysre9uq; _clck=exlw9k%7C2%7Cg52%7C0%7C0; u_ukey=A10702B8689642C6BE607730E11E6E4A; u_uver=1.0.0; u_dpass=ksc%2BFdx3%2FN69gJPV0HV%2FOGPg5Fmga0MZpmJoVPqK1%2B8bJeKfGJ2m5y8CIai3Y5y3Hi80LrSsTFH9a%2B6rtRvqGg%3D%3D; u_did=EF1BD7C0A373430CBBE5ED2238FF3705; u_ttype=WEB; cid=14293a80da86576790d391444f5fa3421775748887; THSSESSID=c2183c316d3813f8fa33d2f441; _clsk=g8f6p71uaj2d%7C1775749995823%7C15%7C1%7C; ",
    "host": "www.iwencai.com",
    "origin": "https://www.iwencai.com",
    "referer": "https://www.iwencai.com/unifiedwap/result?w=K&querytype=stock&sign=1775748932069",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
}
with open("chameleon.js", mode='r', encoding='utf-8') as f:
    js = execjs.compile(f.read())
js_ret = js.call("fn")
v = js_ret.split(";")[0].split('=')[-1]
question = "小米"

payload = {
    "source": "Ths_iwencai_Xuangu",
    "version": "2.0",
    "query_area": "",
    "add_info": "{\"urp\":{\"scene\":1,\"company\":1,\"business\":1},\"contentType\":\"json\",\"searchInfo\":true}",
    "question": question,
    "perpage": "50",
    "page": "2",
    "secondary_intent": "stock",
    "log_info": "{\"input_type\":\"typewrite\"}",
    "rsh": "Ths_iwencai_Xuangu_1txrnul23unlwnuxei986b713ysre9uq"
}

header['hexin-v'] = v
header['cookie'] += "v=" + v

# 使用form-data格式发送数据，保持原有的content-type
res = requests.post(url=url, headers=header, data=payload)
data = json.loads(res.text)
result = json.dumps(data, ensure_ascii=False, indent=2)
result = json.loads(result)
end_result = result['data']['answer'][0]['txt'][0]['content']['components'][0]['data']['datas']
for item in end_result:
    print(item)
