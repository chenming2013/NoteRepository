import java.util.Arrays;

/**
	ц╟ещеепР
 */
public class BubbleSort
{
	public static void main(String[] args)
	{
		int[] arr = new int[]{4,5,1,6,9,12,32,54,7,8};
		//ц╟ещеепР
		for(int i=0;i<arr.length-1;i++)
		{
			for(int j=0;j<arr.length-1-i;j++)
			{
				if(arr[j]>arr[j+1])
				{
					int temp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = temp;
				}
			}
		}
		System.out.println(Arrays.toString(arr));
	}
}