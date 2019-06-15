import os
import sys
print(sys.argv)
if (sys.argv[3] == '1'):
	print("ON - DEVICE")
	os.system("sh /home/pi/plc-ctrl/app/controllers/plc-communicate/on" + sys.argv[2] + ".sh " + sys.argv[1])
else:
	print("OFF - DEVICE")
	os.system("sh /home/pi/plc-ctrl/app/controllers/plc-communicate/off" + sys.argv[2] + ".sh " + sys.argv[1])
