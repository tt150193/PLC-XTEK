import time
import sys
import os
#t = time
#t.sleep(0.5)
cwd = os.getcwd()
if (sys.argv[2] == "true"):
	os.system("python /home/pi/plc-ctrl/app/controllers/plc-communicate/c.py " + sys.argv[3]+" " + str(int(sys.argv[1].split("D")[1]) - 1) + " 1")
elif (sys.argv[2] == "false"):
	os.system("python /home/pi/plc-ctrl/app/controllers/plc-communicate/c.py "+sys.argv[3]+" " + str(int(sys.argv[1].split("D")[1]) - 1) + " 0")
else:
	print("NOT FOUND")
print(cwd)
print("WRITE: " + sys.argv[2] + " TO DEVICE: " + sys.argv[1])