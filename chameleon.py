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
    "cookie": "your cookie",
    "host": "www.iwencai.com",
    "origin": "https://www.iwencai.com",
    "referer": "https://www.iwencai.com/unifiedwap/result?w=K&querytype=stock&sign=1775748932069",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "your UA"
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
