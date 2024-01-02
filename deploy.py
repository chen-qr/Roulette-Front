import paramiko
from scp import SCPClient
import os
import time
import subprocess

key = paramiko.RSAKey.from_private_key_file("/Users/chenqirong/.ssh/id_rsa", password="chenqirong")

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('207.246.66.68', username='root', pkey=key)

# zip -r blog.zip *
export_dir = "out"
zip_name = "lightlink_roulette.zip"
remote_dir = "/var/www/html/lightlink_roulette"

cmd_zip = f"cd {os.path.join(os.getcwd(), export_dir)} && rm -f {zip_name} && zip -r {zip_name} *"
print(subprocess.getoutput(cmd_zip))
print("完成打包")

local_folder = os.path.join(os.getcwd(), export_dir, zip_name)

# 清空待上传的文件夹
stdin, stdout, stderr = ssh.exec_command(f"rm -rf {remote_dir}/*")
print("已经清空服务器上的文件夹")

# 利用SCP上传文件夹
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

# 关闭连接
ssh.close()