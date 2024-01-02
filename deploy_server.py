import paramiko
from scp import SCPClient
import os
import time
import subprocess

upload_list = [
    ".next",
    "package.json"
]

export_dir = ".product"
zip_name = "product.zip"
remote_dir = "/root/lightlink_roulette"

# 检查 .product 文件夹是否存在，如果存在则删除
if os.path.exists(export_dir):
    subprocess.getoutput(f"rm -rf {export_dir}")
    
# 检查 .product 文件夹是否存在
if not os.path.exists(export_dir):
    os.makedirs(export_dir)

# 克隆代码到本地
cp_product_fils = f"cp -rf .next package.json {export_dir}"
print(subprocess.getoutput(cp_product_fils))

# 打包文件
# zip打包默认不包含隐藏文件夹，所以要特意说明打包 .next
cmd_zip = f"cd {os.path.join(os.getcwd(), export_dir)} && rm -f {zip_name} && zip -r {zip_name} {' '.join(upload_list)}"
print(subprocess.getoutput(cmd_zip))

local_folder = os.path.join(os.getcwd(), export_dir, zip_name)

# 上传到服务器
key = paramiko.RSAKey.from_private_key_file("/Users/chenqirong/.ssh/id_rsa", password="chenqirong")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('207.246.66.68', username='root', pkey=key)
stdin, stdout, stderr = ssh.exec_command(f"cd {remote_dir} && rm -rf {' '.join(upload_list)}")
print("已经清空服务器上的文件夹")

start_time = time.time()
try:
    scpclient = SCPClient(ssh.get_transport(), socket_timeout=35.0)
    scpclient.put(local_folder, remote_dir, True)
except Exception as e:
    print("上传失败")
    print(str(e.args))
    raise Exception("上传失败！！！")
else:
    print("上传成功")
finally:
    scpclient.close()
    end_time = time.time()
    print("上传耗时: {:.2f}秒".format(end_time - start_time))

try:
    stdin, stdout, stderr = ssh.exec_command(f"cd {remote_dir} && unzip {zip_name} && rm {zip_name}")
    if stdout.channel.recv_exit_status() != 0:
        print("解压失败")
except Exception as e:
    print("解压失败")
    print(str(e.args))
else:
    print("解压成功")
finally:
    print(stdout)


# npm install
# nohup npm run start &

# 关闭连接
ssh.close()