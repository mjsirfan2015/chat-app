import socketio
import sys
# standard Python
sio = socketio.Client()#logger=True, engineio_logger=True)

sio.connect('http://localhost:8000',namespaces='/test')

print('my sid is', sio.sid)


print(sys.argv)
@sio.event(namespace='/test')
def response(data):
    print(data)
sio.emit('begin_chat',sys.argv[2],namespace='/test')
while True:
    try:
        sio.emit('message', {'name':sys.argv[1],'message': input(),'room':sys.argv[2]},namespace='/test')
        #print(f"data:{data}")
    except EOFError:
        sio.emit('exit_chat',sys.argv[2],namespace='/test')
        sio.disconnect()
        break
