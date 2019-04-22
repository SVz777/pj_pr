import subprocess
from http.server import SimpleHTTPRequestHandler, HTTPServer
import os
import shutil

protocol = "HTTP/1.1"
server_address = ("", 8000)

SimpleHTTPRequestHandler.protocol_version = protocol

src = 'dist'
if not os.path.exists(src):
    s = subprocess.Popen("yarn run pro", shell=True)
    s.wait()

shutil.copy('logo.png', 'dist'+os.sep+'static'+os.sep+'logo.png')

os.chdir(src)

with HTTPServer(server_address, SimpleHTTPRequestHandler) as httpd:
    sa = httpd.socket.getsockname()
    serve_message = "Serving HTTP on {host} port {port} (http://{host}:{port}/) ..."
    print(serve_message.format(host=sa[0], port=sa[1]))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nKeyboard interrupt received, exiting.")
        exit(1)
