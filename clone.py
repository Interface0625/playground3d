import os
from datetime import datetime

def log(msg):
	print(msg)

def clone(
	user = "Interface0625", 
	path = None):
	if path == None: return
	url = "https://github.com/%s/%s.git" % (user, path)

	if os.path.exists(path):
		log("path exists")
		dest_path = ".%s.old-%s" % (path, datetime.now())
		os.rename(path, dest_path)
		log("done renaming %s to %s" % (path, dest_path))

	cmd = "git clone %s" % url
	os.system(cmd)
	log("done cloning %s" % url)

if __name__ == '__main__':
	import sys
	if len(sys.argv) > 1:
		if len(sys.argv) == 3:
			clone(sys.argv[1], sys.argv[2])
		else:
			clone(path=sys.argv[-1])