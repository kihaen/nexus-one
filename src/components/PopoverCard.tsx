import React, { forwardRef, useRef } from 'react';
import { Card, Image, Stack, CardBody, Heading, Text, CardFooter, IconButton } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import Router from 'next/router';

interface PopoverCardProps {
    title?: string;
    description?: string;
    coverImg?: string;
    footer?: JSX.Element;
    postId?: string;
    onClose: () => void;
    display? : string;
}

const PopoverCard = forwardRef<HTMLDivElement, PopoverCardProps>(({ title, description, coverImg, footer, postId, onClose, display = 'flex' }: PopoverCardProps, ref) => {

    return (
        <Card
            direction={{ base: 'row' }}
            minWidth={'300px'}
            maxWidth={'500px'}
            height={'150px'}
            overflow="hidden"
            marginTop={'15px'}
            className="popoverCard"
            variant="outline"
            ref={ref}
            display={display}
        >
            <Image
                objectFit="cover"
                maxW={{ base: '100px' }}
                src={coverImg}
                cursor="pointer"
                onClick={(e) => {
                    e.preventDefault();
                    Router.push(`/p/${postId}`);
                }}
                alt="Cover image"
            />
            <Stack>
                <CardBody paddingBottom="0px" minWidth="50px">
                    <IconButton
                        icon={<CloseIcon height="8px" width="8px" />}
                        aria-label="close"
                        onClick={onClose}
                        position="absolute"
                        top="5px"
                        right="5px"
                        width="15px"
                        height="15px"
                        minWidth="25px"
                    />
                    <Heading
                        onClick={(e) => {
                            e.preventDefault();
                            Router.push(`/p/${postId}`);
                        }}
                        cursor="pointer"
                        size="sm"
                    >
                        {title || ''}
                    </Heading>
                    <Text py="3" fontSize="12">
                        {description || ''}
                    </Text>
                </CardBody>
                <CardFooter fontSize="12" paddingTop="0px">
                    {footer}
                </CardFooter>
            </Stack>
        </Card>
    );
});

export default PopoverCard;