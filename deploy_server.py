import subprocess
import os

# 检查 .product 文件夹是否存在，如果存在则删除
if os.path.exists(".product"):
    subprocess.getoutput("rm -rf .product")
    
# 检查 .product 文件夹是否存在
if not os.path.exists(".product"):
    os.makedirs(".product")

# 克隆代码到本地
cp_product_fils = f"cp -rf .next package.json .product"
subprocess.getoutput(cp_product_fils)

# 发布代码到服务器

# 在服务器编译