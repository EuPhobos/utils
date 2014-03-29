#!/usr/bin/lua

t = 0
s = os.date("%S")
n = 0

while 1 do
	n = os.date("%S")

	if n > s then
		s = n
		print(t)
		t = 0
	end
	t = t + 1
end
