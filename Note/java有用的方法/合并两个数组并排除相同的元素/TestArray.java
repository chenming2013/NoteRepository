/**
* 该算法是合并两个数组并除去相同的元素(不借助TreeSet、Apache Commons的ArrayUtils等工具集)
*	注：不论arrA中或者arrB中是否有重复元素,都会被去除
*/
public class TestArray
{

	public static void main(String[] args){
		
		int[] arrA = new int[]{1,2,3,7,21,2,21,22};
		
		int[] arrB = new int[]{3,4,5,6,7,8,9};

		int[] newArr = new int[arrA.length + arrB.length];
		
		int count = 0;
		for(int i=0;i<arrA.length;i++){
			for(int j=0;j<newArr.length;j++){
				if(newArr[j]==arrA[i]){
					break;
				}else{
					if(j==newArr.length-1){
						newArr[count] = arrA[i];
						count++;
					}
				}
			}
		}
		
		for(int i=0;i<arrB.length;i++){
			for(int j=0;j<newArr.length;j++){
				if(newArr[j]==arrB[i]){
					break;
				}else{
					if(j==newArr.length-1){
						newArr[count] = arrB[i];
						count++;
					}
				}
			}
		}

		for(int i=0;i<newArr.length;i++){
			System.out.println(newArr[i]);
		}

	}
}