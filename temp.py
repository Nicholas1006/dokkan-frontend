from dokkanfunctions import *

powerOf2=1
for x in range(0,32):
    print(extractClassType(str(powerOf2), DEVEXCEPTIONS=False),end=" ")
    powerOf2*=2