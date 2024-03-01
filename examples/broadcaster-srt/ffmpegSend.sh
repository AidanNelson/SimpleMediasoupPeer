ffmpeg \
	-re \
	-v info \
	-stream_loop -1 \
	-i ./test.mp4 \
	-map 0:v:0 \
	-pix_fmt yuv420p -c:v libvpx -b:v 1000k -deadline realtime -cpu-used 4 \
	-f tee \
	"[select=v:f=rtp:ssrc=2222:payload_type=101]rtp://127.0.0.1:44317?rtcpport=47624"

	# "[select=a:f=rtp:ssrc=${AUDIO_SSRC}:payload_type=${AUDIO_PT}]rtp://${audioTransportIp}:${audioTransportPort}?rtcpport=${audioTransportRtcpPort}|[select=v:f=rtp:ssrc=${VIDEO_SSRC}:payload_type=${VIDEO_PT}]rtp://${videoTransportIp}:${videoTransportPort}?rtcpport=${videoTransportRtcpPort}"